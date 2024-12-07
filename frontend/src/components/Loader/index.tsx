import loader from '../../assets/loader.gif'
import { Container } from "./style";

interface LoaderProps {
    show: boolean;
}


export function Loader({ show }: LoaderProps) {
    return (
        <Container show={show}>
            <div className="loader">
                <img src={loader} alt="" />
            </div>
        </Container>
    );

}