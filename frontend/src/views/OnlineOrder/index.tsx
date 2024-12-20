// import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { PAYMENT_METHODS } from "../../constants";
import { FontAwesomeIcon, } from "@fortawesome/react-fontawesome";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
    FormField,
    Label,
    Input,
    Select,
    Textarea,
    InlineFormField,
    CheckboxContainer,
    Checkbox,
    ErrorMessage,
    PrimaryButton
} from "../../styles/global";

import { Form, Container, FormHeader } from "./style";

interface INewOrder {
    description: string;
    additional_information: string;
    has_card: boolean;
    payment_received: boolean;
    delivery_date: string;
    payment_method: string;
    products_value: number;
    delivery_fee: number;
    total: number;
}

export function OnlineOrder() {

    const {
        register,
        formState: { errors },
    } = useForm<INewOrder>();

    return (
        <Container>
            <Form>
                <FormHeader>
                    <FontAwesomeIcon icon={faWhatsapp as any} size="3x"/>
                    <h2>Novo Pedido</h2>
                </FormHeader>
                <FormField>
                    <Label>Descrição do Pedido</Label>
                    <Textarea placeholder=" 1x Bouquet de rosas
                    1x cartao
                    1x caixa de bombom" {...register("description", {
                        required: "Descrição do pedido é obrigatória",
                    })}
                    />
                    {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
                </FormField>
                <FormField>
                    <Label>Observações</Label>
                    <Textarea placeholder="Observações" {...register("additional_information")}
                    />
                </FormField>
                <InlineFormField>
                    <FormField>
                        <CheckboxContainer>
                            <Checkbox type="checkbox" {...register("has_card")} />
                            <Label>Pedido Contém Cartão</Label>
                        </CheckboxContainer>
                    </FormField>
                    <FormField>
                        <CheckboxContainer>
                            <Checkbox type="checkbox" {...register("payment_received")} />
                            <Label>Pagamento Recebido</Label>
                        </CheckboxContainer>
                    </FormField>
                </InlineFormField>
                
                <InlineFormField>
                    <FormField>
                        <Label>Data de Entrega</Label>
                        <Input type="date" {...register("delivery_date", {
                            required: "Data de entrega é obrigatória",
                        })}/>
                        {errors.delivery_date && <ErrorMessage>{errors.delivery_date.message}</ErrorMessage>}
                    </FormField>
                    <FormField>
                        <Label>Método de pagamento</Label>
                        <Select {...register("payment_method")}>
                            {Object.entries(PAYMENT_METHODS).map(([key, value]) => (
                                <option key={key} value={key}>{value}</option>
                            ))}
                        </Select>
                    </FormField> 
                </InlineFormField>
                <InlineFormField>
                    <FormField>
                        <Label>Valor total dos Produtos</Label>
                        <Input type="number" placeholder="Total" {...register("products_value", {
                            required: "Valor total é obrigatório",
                        })} />
                        {errors.products_value && <ErrorMessage>{errors.products_value.message}</ErrorMessage>}
                    </FormField>
                    <FormField>
                        <Label>Taxa de entrega</Label>
                        <Input type="number" placeholder="0.00" {...register("delivery_fee", {
                        })} />
                    </FormField>
                </InlineFormField>
                <PrimaryButton type="submit">Finalizar Pedido</PrimaryButton>
            </Form>
        </Container>
    );
}