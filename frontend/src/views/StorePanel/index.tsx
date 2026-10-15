import { memo, useCallback, useContext, useEffect, useReducer, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowUp,
    faBagShopping,
    faBell,
    faBoxOpen,
    faCheck,
    faCircleCheck,
    faClock,
    faLocationDot,
    faPlay,
    faPlus,
    faScrewdriverWrench,
    faSeedling,
    faTriangleExclamation,
    faTruck,
    faVolumeXmark,
    faWallet,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { getPanelOrders } from "../../services/orderService";
import {
    isAudioRunning,
    playDeliverySound,
    playNotificationSound,
    playPaymentConfirmedSound,
    unlockAudio
} from "../../utils/notificationSounds";
import {
    alertQueueReducer,
    AlertKind,
    displayDuration,
    findMissedOrders,
    initialAlertQueueState,
    IPanelAlert,
    parseOrderCode
} from "./alertQueue";
import {
    daysLate,
    IPanelOrder,
    IPanelOrdersResponse,
    ORIGIN_LABEL,
    PanelOrderStatus,
    visibleOrders
} from "./storePanel";
import { AlertPopup, Container, SoundBlockedBanner, StartScreen } from "./style";

const REFRESH_INTERVAL_MS = 60000;
const EVENT_REFRESH_DELAY_MS = 1500;
const STALE_AFTER_MS = 150000;
const FRESH_HIGHLIGHT_MS = 8000;
const AUTO_SCROLL_INTERVAL_MS = 8000;
const AUTO_SCROLL_PAUSE_MS = 20000;

const COLUMNS: { status: PanelOrderStatus; label: string; icon: IconDefinition; footer: string }[] = [
    { status: 'todo', label: 'A FAZER', icon: faClock, footer: 'Aguardando início' },
    { status: 'production', label: 'EM PRODUÇÃO', icon: faScrewdriverWrench, footer: 'Preparando com carinho' },
    { status: 'delivery', label: 'EM ENTREGA', icon: faTruck, footer: 'A caminho do destino' },
];

const ALERT_ICON: Record<AlertKind, IconDefinition> = {
    new: faPlus,
    payment: faWallet,
    done: faCheck
};

const formatTime = (date: Date, withSeconds = false) =>
    date.toLocaleTimeString('pt-BR', withSeconds
        ? { hour: '2-digit', minute: '2-digit', second: '2-digit' }
        : { hour: '2-digit', minute: '2-digit' });

const formatMoney = (value: unknown) => {
    const amount = Number(value);
    return Number.isFinite(amount)
        ? amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : '';
};

const playAlertSound = (kind: AlertKind) => {
    if (kind === 'payment') {
        playPaymentConfirmedSound();
    } else if (kind === 'done') {
        playDeliverySound();
    } else {
        playNotificationSound();
    }
};

const createAlertId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function StorePanel() {
    const { storeData } = useContext(AuthContext);
    const [started, setStarted] = useState(false);

    // Se o navegador já libera o som (ex.: Chrome aberto com
    // --autoplay-policy=no-user-gesture-required), inicia sem precisar de clique.
    // Assim o painel volta sozinho depois de uma queda de energia.
    useEffect(() => {
        let active = true;
        unlockAudio().then(running => {
            if (active && running) setStarted(true);
        });
        return () => {
            active = false;
        };
    }, []);

    const handleStart = async () => {
        // O clique libera o som no Chrome (política de autoplay)
        await unlockAudio();
        playNotificationSound();

        try {
            await document.documentElement.requestFullscreen?.();
        } catch (error) {
            // F11 continua funcionando se o navegador recusar
        }

        setStarted(true);
    };
    if (!started) {
        return (
            <StartScreen>
                <span className="start-mark">
                    {storeData?.logo
                        ? <img src={storeData.logo} alt={storeData.name} />
                        : <FontAwesomeIcon icon={faSeedling} />}
                </span>
                <h1>Painel da loja</h1>
                <p>
                    Mostra os pedidos de hoje e os atrasados, e toca um som a cada pedido novo,
                    pagamento confirmado ou entrega concluída.
                </p>
                <button type="button" onClick={handleStart}>
                    <FontAwesomeIcon icon={faPlay} /> Iniciar painel
                </button>
                <span className="start-hint">Você deve ouvir um bip ao iniciar. Use F11 para tela cheia.</span>
            </StartScreen>
        );
    }

    return <PanelBoard storeName={storeData?.name || "Painel da loja"} storeLogo={storeData?.logo} />;
}

function PanelBoard({ storeName, storeLogo }: { storeName: string; storeLogo?: string }) {
    const [data, setData] = useState<IPanelOrdersResponse | null>(null);
    const [lastSuccess, setLastSuccess] = useState<number | null>(null);
    const [freshCodes, setFreshCodes] = useState<number[]>([]);
    const [soundBlocked, setSoundBlocked] = useState(false);
    const [scrollPauseSignal, setScrollPauseSignal] = useState(0);
    const [alertState, dispatchAlert] = useReducer(alertQueueReducer, initialAlertQueueState);

    const baselineCode = useRef<number | null>(null);
    const alertedCodes = useRef<Set<number>>(new Set());
    const inFlight = useRef(false);
    const refreshPending = useRef(false);
    const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const freshTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
    const queueLength = useRef(0);
    const mounted = useRef(true);

    queueLength.current = alertState.queue.length;

    const markFresh = useCallback((code: number) => {
        setFreshCodes(current => current.includes(code) ? current : [...current, code]);
        freshTimers.current.push(setTimeout(() => {
            setFreshCodes(current => current.filter(value => value !== code));
        }, FRESH_HIGHLIGHT_MS));
    }, []);

    const pushAlert = useCallback((kind: AlertKind, code: number | null, title: string, detail?: string) => {
        if (code !== null) {
            alertedCodes.current.add(code);
            if (kind !== 'done') {
                markFresh(code);
                setScrollPauseSignal(value => value + 1);
            }
        }

        dispatchAlert({
            type: 'enqueue',
            alert: { id: createAlertId(), kind, code, title, detail, at: Date.now() }
        });
    }, [markFresh]);

    // Pedidos online/link que chegaram sem aviso pelo socket
    const checkMissedOrders = useCallback((orders: IPanelOrder[]) => {
        if (baselineCode.current === null) {
            baselineCode.current = orders.reduce((max, order) => Math.max(max, order.code), 0);
            return;
        }

        findMissedOrders(orders, baselineCode.current, alertedCodes.current).forEach(order => {
            pushAlert('new', order.code, 'NOVO PEDIDO', ORIGIN_LABEL[order.origin]);
        });
    }, [pushAlert]);

    const fetchOrders = useCallback(async () => {
        if (inFlight.current) {
            refreshPending.current = true;
            return;
        }

        inFlight.current = true;

        try {
            const { data: response } = await getPanelOrders();
            if (!mounted.current) return;

            setData(response);
            setLastSuccess(Date.now());
            checkMissedOrders(response.orders);
        } catch (error) {
            console.error('[Painel] Erro ao buscar pedidos:', error);
        } finally {
            inFlight.current = false;
            if (refreshPending.current && mounted.current) {
                refreshPending.current = false;
                fetchOrders();
            }
        }
    }, [checkMissedOrders]);

    const scheduleRefresh = useCallback(() => {
        if (refreshTimer.current) {
            clearTimeout(refreshTimer.current);
        }
        refreshTimer.current = setTimeout(fetchOrders, EVENT_REFRESH_DELAY_MS);
    }, [fetchOrders]);

    // Carga inicial, atualização periódica e ao voltar a conexão
    useEffect(() => {
        mounted.current = true;
        const highlightTimers = freshTimers.current;
        fetchOrders();

        const interval = setInterval(fetchOrders, REFRESH_INTERVAL_MS);
        const onVisible = () => {
            if (document.visibilityState === 'visible') fetchOrders();
        };

        document.addEventListener('visibilitychange', onVisible);
        window.addEventListener('online', fetchOrders);

        return () => {
            mounted.current = false;
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisible);
            window.removeEventListener('online', fetchOrders);
            if (refreshTimer.current) clearTimeout(refreshTimer.current);
            highlightTimers.forEach(clearTimeout);
        };
    }, [fetchOrders]);

    // Eventos do socket (repassados pelo OrdersContext como eventos da janela)
    useEffect(() => {
        const onNewOrder = (event: Event) => {
            const detail = (event as CustomEvent).detail || {};
            const viaLink = String(detail.message || '').toLowerCase().includes('link');
            pushAlert('new', parseOrderCode(detail.orderCode), 'NOVO PEDIDO', viaLink ? 'Pedido via link' : 'Loja online');
            scheduleRefresh();
        };

        const onPaymentConfirmed = (event: Event) => {
            const detail = (event as CustomEvent).detail || {};
            const amount = formatMoney(detail.amount);
            pushAlert('payment', parseOrderCode(detail.orderCode), 'PAGAMENTO CONFIRMADO', amount ? `Loja online · ${amount}` : 'Loja online');
            scheduleRefresh();
        };

        const onDelivered = (event: Event) => {
            const detail = (event as CustomEvent).detail || {};
            pushAlert('done', parseOrderCode(detail.orderCode), 'PEDIDO ENTREGUE', detail.deliveryMan ? `Motoboy ${detail.deliveryMan}` : undefined);
            scheduleRefresh();
        };

        window.addEventListener('new-order', onNewOrder);
        window.addEventListener('order-payment-confirmed', onPaymentConfirmed);
        window.addEventListener('order-delivered', onDelivered);

        return () => {
            window.removeEventListener('new-order', onNewOrder);
            window.removeEventListener('order-payment-confirmed', onPaymentConfirmed);
            window.removeEventListener('order-delivered', onDelivered);
        };
    }, [pushAlert, scheduleRefresh]);

    // Exibe um alerta por vez: som + pop-up juntos, depois passa para o próximo
    const currentAlert = alertState.current;
    useEffect(() => {
        if (!currentAlert) return;

        playAlertSound(currentAlert.kind);

        const soundCheck = setTimeout(() => setSoundBlocked(!isAudioRunning()), 600);
        const next = setTimeout(() => dispatchAlert({ type: 'next' }), displayDuration(queueLength.current));

        return () => {
            clearTimeout(soundCheck);
            clearTimeout(next);
        };
    }, [currentAlert]);

    // Confere o som de tempos em tempos (o navegador pode suspender o áudio)
    useEffect(() => {
        const interval = setInterval(() => setSoundBlocked(!isAudioRunning()), 30000);
        return () => clearInterval(interval);
    }, []);

    // Mantém a tela acordada enquanto o painel está aberto
    useEffect(() => {
        let wakeLock: any = null;

        const requestWakeLock = async () => {
            try {
                if ('wakeLock' in navigator && document.visibilityState === 'visible') {
                    wakeLock = await (navigator as any).wakeLock.request('screen');
                }
            } catch (error) {
                // Sem suporte ou recusado: a tela pode apagar pela configuração do sistema
            }
        };

        const onVisible = () => {
            if (document.visibilityState === 'visible') requestWakeLock();
        };

        requestWakeLock();
        document.addEventListener('visibilitychange', onVisible);

        return () => {
            document.removeEventListener('visibilitychange', onVisible);
            wakeLock?.release?.().catch(() => undefined);
        };
    }, []);

    const handleUnlockSound = async () => {
        const running = await unlockAudio();
        setSoundBlocked(!running);
        if (running) playNotificationSound();
    };

    const today = data?.today ?? '';
    const visible = visibleOrders(data?.orders ?? [], today);
    const todoCount = visible.today.filter(order => order.status === 'todo').length;

    return (
        <Container>
            <header className="panel-header">
                <div className="store-brand">
                    <span className="brand-mark">
                        {storeLogo
                            ? <img src={storeLogo} alt={storeName} />
                            : <FontAwesomeIcon icon={faSeedling} />}
                    </span>
                    <div>
                        <h1>{storeName}<span className="brand-dot">.</span></h1>
                        <p>PAINEL DA LOJA</p>
                    </div>
                </div>
                <PanelClock />
                <div className="header-right">
                    <div className="summary-counts">
                        <div className="summary-overdue"><span>Atrasados</span><strong>{visible.overdue.length}</strong></div>
                        <div><span>Hoje</span><strong>{visible.today.length}</strong></div>
                        <div><span>A fazer</span><strong>{todoCount}</strong></div>
                    </div>
                    <UpdateIndicator lastSuccess={lastSuccess} />
                </div>
            </header>

            <section className="overdue-section" aria-labelledby="overdue-title">
                <div className="section-heading">
                    <div className="section-title">
                        <FontAwesomeIcon icon={faClock} />
                        <h2 id="overdue-title">ATRASADOS</h2>
                        <span className="section-count">{visible.overdue.length}</span>
                    </div>
                    <span className="section-note">Prioridade na produção <FontAwesomeIcon icon={faArrowUp} /></span>
                </div>
                <AutoScroll itemCount={visible.overdue.length}>
                    <div className="overdue-list">
                        {visible.overdue.map(order => (
                            <OrderCard key={order.code} order={order} today={today} overdue />
                        ))}
                        {data && visible.overdue.length === 0 && <p className="empty-list">Nenhum pedido atrasado</p>}
                    </div>
                </AutoScroll>
            </section>

            <section className="today-section" aria-labelledby="today-title">
                <div className="today-heading">
                    <h2 id="today-title">HOJE</h2>
                    <span>{visible.today.length} {visible.today.length === 1 ? 'pedido' : 'pedidos'}</span>
                    <span className="today-line" />
                    <span className="workday-status"><span className="connection-dot" />Operação em andamento</span>
                </div>
                <div className="production-board">
                    {COLUMNS.map(({ status, label, icon, footer }) => {
                        const list = visible.today.filter(order => order.status === status);
                        return (
                            <section className={`production-column status-${status}`} key={status} aria-label={label}>
                                <header className="column-heading">
                                    <FontAwesomeIcon icon={icon} />
                                    <h3>{label}</h3>
                                    <span className="column-count">{list.length}</span>
                                </header>
                                <AutoScroll itemCount={list.length} pauseSignal={status === 'todo' ? scrollPauseSignal : 0}>
                                    <div className="column-list">
                                        {list.map(order => (
                                            <OrderCard
                                                key={order.code}
                                                order={order}
                                                today={today}
                                                fresh={freshCodes.includes(order.code)}
                                            />
                                        ))}
                                        {list.length === 0 && (
                                            <div className="empty-list">
                                                <FontAwesomeIcon icon={faBoxOpen} />
                                                {data ? 'Nenhum pedido' : 'Carregando pedidos...'}
                                            </div>
                                        )}
                                    </div>
                                </AutoScroll>
                                <div className="column-bottom">
                                    <span className="status-dot" />
                                    {footer}
                                    <span>{list.length} {list.length === 1 ? 'pedido' : 'pedidos'}</span>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </section>

            <footer className="events-section">
                <div className="events-heading">
                    <FontAwesomeIcon icon={faCircleCheck} />
                    <h2>ÚLTIMOS EVENTOS</h2>
                </div>
                <div className="events-list">
                    {alertState.history.map(alert => (
                        <div className={`event event-${alert.kind}`} key={alert.id}>
                            <span className="event-icon"><FontAwesomeIcon icon={ALERT_ICON[alert.kind]} /></span>
                            <div>
                                <time>{formatTime(new Date(alert.at))}</time>
                                <p>{eventText(alert)}</p>
                            </div>
                        </div>
                    ))}
                    {alertState.history.length === 0 && <p className="events-empty">Nenhum evento desde que o painel foi iniciado</p>}
                </div>
            </footer>

            {currentAlert && (
                <AlertPopup key={currentAlert.id} className={`alert-${currentAlert.kind}`} role="alert">
                    <span className="alert-icon"><FontAwesomeIcon icon={currentAlert.kind === 'new' ? faBell : ALERT_ICON[currentAlert.kind]} /></span>
                    <div className="alert-body">
                        <div className="alert-title">{currentAlert.title}</div>
                        {currentAlert.code !== null && <div className="alert-code">#{currentAlert.code}</div>}
                        {currentAlert.detail && <div className="alert-detail">{currentAlert.detail}</div>}
                    </div>
                    {alertState.queue.length > 0 && <span className="alert-queue">+{alertState.queue.length} na fila</span>}
                </AlertPopup>
            )}

            {soundBlocked && (
                <SoundBlockedBanner type="button" onClick={handleUnlockSound}>
                    <FontAwesomeIcon icon={faVolumeXmark} /> SOM DESLIGADO — clique para reativar
                </SoundBlockedBanner>
            )}
        </Container>
    );
}

function eventText(alert: IPanelAlert) {
    const title = alert.title.charAt(0) + alert.title.slice(1).toLowerCase();
    const code = alert.code !== null ? ` #${alert.code}` : '';
    return `${title}${code}${alert.detail ? ` · ${alert.detail}` : ''}`;
}

const OrderCard = memo(function OrderCard({ order, today, overdue, fresh }: {
    order: IPanelOrder;
    today: string;
    overdue?: boolean;
    fresh?: boolean;
}) {
    const late = overdue ? daysLate(order.date, today) : 0;

    return (
        <article
            className={`order-card ${overdue ? 'overdue-card' : ''} ${fresh ? 'new-order' : ''}`}
            aria-label={`Pedido #${order.code}`}
        >
            <div className="order-heading">
                <strong className="order-code">#{order.code}</strong>
                {overdue ? (
                    <span className="late-badge"><FontAwesomeIcon icon={faClock} />HÁ {late} {late === 1 ? 'DIA' : 'DIAS'}</span>
                ) : fresh ? (
                    <span className="new-badge"><FontAwesomeIcon icon={faPlus} /> NOVO PEDIDO</span>
                ) : (
                    <span className="order-origin">{ORIGIN_LABEL[order.origin]}</span>
                )}
            </div>
            <ul className="order-items">
                {order.items.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
            <div className="order-details">
                <span className={`fulfillment ${order.fulfillment === 'RETIRADA' ? 'pickup' : ''}`}>
                    <FontAwesomeIcon icon={order.fulfillment === 'ENTREGA' ? faTruck : faBagShopping} />
                    {order.fulfillment}
                </span>
                {order.fulfillment === 'ENTREGA' && order.neighborhood && (
                    <span className="neighborhood"><FontAwesomeIcon icon={faLocationDot} />{order.neighborhood}</span>
                )}
            </div>
        </article>
    );
});

// Relógio isolado: só ele re-renderiza a cada segundo
function PanelClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="panel-clock">
            <time className="clock-time">{formatTime(now)}</time>
            <span className="clock-date">
                {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
        </div>
    );
}

function UpdateIndicator({ lastSuccess }: { lastSuccess: number | null }) {
    const [now, setNow] = useState(() => Date.now());
    const [startedAt] = useState(() => Date.now());

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 5000);
        return () => clearInterval(interval);
    }, []);

    const stale = now - (lastSuccess ?? startedAt) > STALE_AFTER_MS;

    return (
        <div className={`update-indicator ${stale ? 'stale' : ''}`} role="status">
            {stale && <FontAwesomeIcon icon={faTriangleExclamation} />}
            <span className="connection-dot" />
            {stale ? 'Sem atualização desde ' : 'Atualizado às '}
            {lastSuccess ? formatTime(new Date(lastSuccess), true) : '--:--:--'}
        </div>
    );
}

// Rola a lista sozinha (o painel não tem mouse) e mostra quantos pedidos estão fora da tela
function AutoScroll({ children, itemCount, pauseSignal = 0 }: {
    children: JSX.Element;
    itemCount: number;
    pauseSignal?: number;
}) {
    const areaRef = useRef<HTMLDivElement>(null);
    const pausedAt = useRef(0);
    const [hiddenCount, setHiddenCount] = useState(0);

    const countHidden = useCallback(() => {
        const area = areaRef.current;
        if (!area) return;

        const top = area.scrollTop;
        const bottom = top + area.clientHeight;
        let hidden = 0;

        area.querySelectorAll<HTMLElement>('.order-card').forEach(card => {
            if (card.offsetTop < top - 1 || card.offsetTop + card.offsetHeight > bottom + 1) {
                hidden += 1;
            }
        });

        setHiddenCount(hidden);
    }, []);

    useEffect(() => {
        countHidden();
    }, [itemCount, countHidden]);

    useEffect(() => {
        const area = areaRef.current;
        if (!area || pauseSignal === 0) return;

        pausedAt.current = Date.now();
        area.scrollTop = 0;
        countHidden();
    }, [pauseSignal, countHidden]);

    useEffect(() => {
        let recount: ReturnType<typeof setTimeout> | null = null;

        const interval = setInterval(() => {
            const area = areaRef.current;
            if (!area || Date.now() - pausedAt.current < AUTO_SCROLL_PAUSE_MS) return;
            if (area.scrollHeight <= area.clientHeight + 2) return;

            const atBottom = area.scrollTop + area.clientHeight >= area.scrollHeight - 2;
            const visibleBottom = area.scrollTop + area.clientHeight;
            // Para no topo do primeiro cartão cortado, para nenhum cartão ficar pela metade em cima
            const firstCut = Array.from(area.querySelectorAll<HTMLElement>('.order-card'))
                .find(card => card.offsetTop + card.offsetHeight > visibleBottom + 1);
            const snapTop = firstCut ? firstCut.offsetTop - 12 : area.scrollHeight;
            const nextTop = atBottom
                ? 0
                : snapTop > area.scrollTop + 1 ? snapTop : area.scrollTop + Math.floor(area.clientHeight * 0.85);

            area.scrollTo({ top: nextTop, behavior: 'smooth' });
            recount = setTimeout(countHidden, 800);
        }, AUTO_SCROLL_INTERVAL_MS);

        window.addEventListener('resize', countHidden);

        return () => {
            clearInterval(interval);
            if (recount) clearTimeout(recount);
            window.removeEventListener('resize', countHidden);
        };
    }, [countHidden]);

    return (
        <div className="scroll-wrapper">
            <div className="scroll-area" ref={areaRef}>
                {children}
            </div>
            {hiddenCount > 0 && <span className="more-badge">+{hiddenCount} fora da tela</span>}
        </div>
    );
}
