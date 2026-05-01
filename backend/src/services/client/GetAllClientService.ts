import prismaClient from '../../prisma';
import { ErrorCodes } from "../../exceptions/root";
import { BadRequestException } from "../../exceptions/bad-request";

class GetAllClientService{
    async execute(page: number = 1, pageSize: number = 10, query?: string) {
        try {
            const skip = (page - 1) * pageSize;
            
            let filters = {};
            
            if (query) {
                const words = query.trim().split(/\s+/);
                
                if (words.length === 1) {
                    filters = {
                        OR: [
                            { first_name: { contains: words[0], mode: 'insensitive' } },
                            { last_name: { contains: words[0], mode: 'insensitive' } },
                            { phone_number: { contains: words[0], mode: 'insensitive' } }
                        ]
                    };
                } else {
                    filters = {
                        AND: words.map(word => ({
                            OR: [
                                { first_name: { contains: word, mode: 'insensitive' } },
                                { last_name: { contains: word, mode: 'insensitive' } }
                            ]
                        }))
                    };
                }
            }

            const [users, total] = await Promise.all([
                prismaClient.client.findMany({
                    where: filters as any,
                    skip,
                    take: pageSize
                }),
                prismaClient.client.count({ where: filters as any })
            ])

            return {
                users,
                total,
                currentPage: page,
                totalPages: Math.ceil(total / pageSize)
            };

        } catch(error: any) {
            throw new BadRequestException(
                error.message,
                ErrorCodes.SYSTEM_ERROR
            )
        }
    }
}

export { GetAllClientService }