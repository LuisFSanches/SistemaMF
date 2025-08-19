import { Request, Response } from 'express'
import { CreateAddressService } from "../../services/address/CreateAddressService"
import { createAddressSchema } from "../../schemas/address/createAddress";
import { ErrorCodes } from "../../exceptions/root";

class CreateAddressController{
	async handle(req: Request, res: Response) {
		const data = req.body;

		const parsed = createAddressSchema.safeParse(data);
		if (!parsed.success) {
			return {
				error: true,
				message: parsed.error.errors[0].message,
				code: ErrorCodes.VALIDATION_ERROR
			};
		}

		const createAddressService = new CreateAddressService();

		const address = await createAddressService.execute(data);

		return res.json(address)
	}
}

export { CreateAddressController }