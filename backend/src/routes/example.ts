import { Request, Response } from 'express';

function exampleRoute(req: Request, res: Response) {
  res.send('This is an example route.');
}

export default exampleRoute;
