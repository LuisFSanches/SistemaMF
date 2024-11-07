import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faUser, faCoins, faUtensils, faBasketShopping } from "@fortawesome/free-solid-svg-icons";
import { Container, Form, FormField, Label, Input } from "./style";
import { NewOrderProgressBar } from "../../components/NewOrderProgressBar";


export function DashboardPage(){
    return(
        <Container>
            <NewOrderProgressBar currentStep={1}/>
            <Form>
                <FormField>
                    <Label>Telefone</Label>
                    <Input type="tel" placeholder="Digite seu telefone" />
                </FormField>
                <FormField>
                    <Label>Nome</Label>
                    <Input type="text" placeholder="Digite seu nome" />
                </FormField>
                <FormField>
                    <Label>Sobrenome</Label>
                    <Input type="text" placeholder="Digite seu sobrenome" />
                </FormField>
            </Form>
        </Container>
    )
}