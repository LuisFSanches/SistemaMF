import express from 'express'
import 'express-async-errors';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();

import { router } from './routes'
import { errorMiddleware } from './middlewares/errors';

const app = express();
app.use(express.json());
app.use(cors());

app.use(router);

/*app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof Error){
    //Se for uma instancia do tipo error
    return res.status(400).json({
      error: err.message
    })
  }

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.'
  })

})*/

app.use(errorMiddleware);

app.listen(3333, () => console.log('Servidor rodando na porta 3333!!!!'))