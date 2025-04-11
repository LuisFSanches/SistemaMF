
import { ReactNode } from "react";
import { Container, AdminItem } from "./style"

const medals: Record<number, ReactNode> = {
    0: "🥇",
    1: "🥈",
    2: "🥉"
};

export function TopAdmins({ admins }: { admins: any[] }) {
    return (
        <Container>
            <h3>Administradores</h3>
            {admins.map((admin) => (
                <AdminItem key={admin.id}>
                    <strong>
                        {admin.name}
                        {medals[admins.indexOf(admin)]}
                    </strong> <br />
                    Pedidos: {admin.orders_count}
                </AdminItem>
            ))}
        </Container>
    )
}
