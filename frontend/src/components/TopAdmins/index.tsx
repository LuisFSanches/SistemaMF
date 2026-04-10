
import { ReactNode } from "react";
import {
    Container,
    AdminItem,
    AdminInfo,
    MedalIcon,
    AdminDetails,
    AdminName,
    AdminOrders,
    AdminsContainer
} from "./style"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';

const medals: Record<number, ReactNode> = {
    0: "🥇",
    1: "🥈",
    2: "🥉"
};

export function TopAdmins({ admins }: { admins: any[] }) {
    return (
        <Container>
            <h3>
                <FontAwesomeIcon icon={faTrophy} color="#F5CB2E" />
                Top Vendedores
            </h3>
            <AdminsContainer>
                {admins.map((admin, index) => (
                    <AdminItem key={admin.id} position={index}>
                        <AdminInfo>
                            <MedalIcon>
                                {medals[index] || "📊"}
                            </MedalIcon>
                            <AdminDetails>
                                <AdminName>{admin.name}</AdminName>
                                <AdminOrders>{admin.orders_count} pedido(s)</AdminOrders>
                            </AdminDetails>
                        </AdminInfo>
                    </AdminItem>
                ))}
            </AdminsContainer>
        </Container>
    )
}
