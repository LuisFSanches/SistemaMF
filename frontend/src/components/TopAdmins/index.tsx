
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
            <h3>Top Vendedores</h3>
            {admins.map((admin) => (
                <AdminItem key={admin.id}>
                    <strong>
                        {admin.name}
                    </strong>
                    - {admin.orders_count} pedido(s)
                    {medals[admins.indexOf(admin)]}
                </AdminItem>
            ))}
        </Container>
    )
}
