import { useState, useEffect, useContext, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronDown, faStore } from "@fortawesome/free-solid-svg-icons";
import { Container, SelectButton, Dropdown, SearchInput, StoreItem, NoStores, LoadingMessage } from "./style";
import { AuthContext } from '../../contexts/AuthContext';
import { IStoreListItem } from "../../interfaces/IStore";

export function StoreSelector() {
    const { storeData, availableStores, loadingStores, handleSwitchStore, loadAvailableStores } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Carregar lojas se ainda não foram carregadas
        if (availableStores.length === 0 && !loadingStores) {
            loadAvailableStores();
        }
    }, [availableStores.length, loadingStores, loadAvailableStores]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const filteredStores = availableStores.filter((store: IStoreListItem) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        store.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectStore = async (storeId: string) => {
        try {
            await handleSwitchStore(storeId);
            setIsOpen(false);
            setSearchTerm("");
        } catch (error) {
            console.error("Erro ao alternar loja:", error);
            alert("Erro ao alternar para a loja selecionada. Tente novamente.");
        }
    };

    return (
        <Container ref={dropdownRef}>
            <SelectButton onClick={() => setIsOpen(!isOpen)}>
                <div>
                    <FontAwesomeIcon icon={faStore} />
                    <span>{storeData ? storeData.name : "Selecione uma loja"}</span>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={isOpen ? "open" : ""} />
            </SelectButton>

            {isOpen && (
                <Dropdown>
                    <SearchInput>
                        <FontAwesomeIcon icon={faSearch} />
                        <input
                            type="text"
                            placeholder="Buscar loja..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </SearchInput>

                    {loadingStores ? (
                        <LoadingMessage>Carregando lojas...</LoadingMessage>
                    ) : filteredStores.length === 0 ? (
                        <NoStores>
                            {searchTerm ? "Nenhuma loja encontrada" : "Nenhuma loja disponível"}
                        </NoStores>
                    ) : (
                        filteredStores.map((store: IStoreListItem) => (
                            <StoreItem
                                key={store.id}
                                onClick={() => handleSelectStore(store.id)}
                                className={storeData?.id === store.id ? "active" : ""}
                            >
                                <div className="store-info">
                                    {store.logo && (
                                        <img src={store.logo} alt={store.name} />
                                    )}
                                    <div>
                                        <strong>{store.name}</strong>
                                        <small>{store.email}</small>
                                        {store._count && (
                                            <small className="count-info">
                                                {store._count.admins} admins | {store._count.store_products} produtos
                                            </small>
                                        )}
                                    </div>
                                </div>
                                {!store.is_active && (
                                    <span className="badge-inactive">Inativa</span>
                                )}
                            </StoreItem>
                        ))
                    )}
                </Dropdown>
            )}
        </Container>
    );
}
