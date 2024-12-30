import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import { Express } from 'express';

export default (app: Express) => {
  app.use(cors());
  
  app.use((req, res, next) => {
    if (req.protocol === 'http' && process.env.NODE_ENV === 'production') {
      res.redirect(`https://${req.headers.host}${req.url}`);
    } else {
      next();
    }
  });

  // Use helmet but disable HTTPS-specific policies
  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,  // Disable COOP if not using HTTPS
  }));
};
