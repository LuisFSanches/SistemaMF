import { Container } from "./style";

export function ErrorAlert({ message }: { message: string }) {
    return (
        <Container>
            <p>{message}</p>
        </Container>
    );
}
