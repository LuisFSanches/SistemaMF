import { useEffect, useState } from "react";
import moment from "moment";
import { Container, DateContainer } from "./style";
import { PageHeader } from "../../styles/global";
import { getPix } from"../../services/pixService";
import { IPix } from "../../interfaces/IPix";
import { Loader } from "../../components/Loader";

export function PixPage(){
    const [pixList, setPixList] = useState<IPix[]>([]);
    const [initialDate, setInitialDate] = useState("");
    const [finalDate, setFinalDate] = useState("");
    const [showLoader, setShowLoader] = useState(false);
    const limits = [10, 20, 30];
    const [selectedLimit, setSelectedLimit] = useState(10);

    useEffect(() => {
        setInitialDate(moment().subtract(15, "days").format("YYYY-MM-DD"));
        setFinalDate(moment().add(2, "days").format("YYYY-MM-DD"));

        async function loadPix(){
            if (!initialDate || !finalDate) return;
            setShowLoader(true);
            const params = `?initial_date=${initialDate}&final_date=${finalDate}&limit=${selectedLimit}`
            const { data } = await getPix(params);
            setPixList(data);
            setShowLoader(false);
        }

        if (initialDate !== "" && finalDate !== "") {
            loadPix();
        }
    }, [initialDate, finalDate, selectedLimit]);

    if (!pixList) return <></>;

    return(
        <Container>
            <Loader show={showLoader} />
            <PageHeader>
                <h1>Pix</h1>
                <DateContainer>
                    <div>
                        <label>Data Inicial</label>
                        <input value={initialDate} type="date" onChange={e => setInitialDate(e.target.value)}/>
                    </div>
                    <div>
                        <label>Data Final</label>
                        <input value={finalDate} type="date" onChange={e => setFinalDate(e.target.value)}/>
                    </div>
                    <div>
                        <label>Limite</label>
                        <select value={limits[0]} onChange={(e) => setSelectedLimit(Number(e.target.value))}>
                            {limits.map(limit => <option key={limit}>{limit}</option>)}
                        </select>
                    </div>
                </DateContainer>
            </PageHeader>
            
            <table>
                <thead className="head">
                    <tr>
                        <th>Recebimento</th>
                        <th>Descrição</th>
                        <th>Cliente</th>
                        <th>Valor</th>
                    </tr>
                </thead>
                <tbody>
                    {pixList?.map(pix => (
                        <tr key={pix.descricao}>
                            <td>{moment(pix.dataEntrada).format("DD/MM/YYYY")}</td>
                            <td>{pix.titulo}</td>
                            <td>
                                {pix.descricao.includes("-") 
                                    ? pix.descricao.split("-").pop()?.trim() || "Sem Cliente"
                                    : "Sem Cliente"}
                            </td>
                            <td>{pix.valor}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Container>
    )
}