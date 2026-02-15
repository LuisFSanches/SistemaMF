import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { Container } from "./style";

export function SuccessAlert({ message }: { message: string }) {
    return (
        <Container>
            <FontAwesomeIcon
                icon={faCircleCheck}
                style={{ marginRight: '10px', fontSize: '20px' }} />
            <p>{message}</p>
        </Container>
    );
}
