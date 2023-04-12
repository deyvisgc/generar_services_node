import { Request, Response } from "express";
import * as fs from "fs"
import * as path from "path"
import {execSync} from "node:child_process" 
export const generarService = async(req: Request, res: Response) => {
    const carpeta = req.body.carpeta
    const nombreService = req.body.nameService

    // Crea la carpeta principal para tu proyecto
    const D = path.join('D:', carpeta)
    if(!fs.existsSync(D)) {
        fs.mkdirSync(`${D}`);
    }
    if(fs.existsSync(`${D}/${nombreService}`)) {
      res.send('El nombre del Servicio ya existe.')
      return
    } else {
      fs.mkdirSync(`${D}/${nombreService}`);
    }
    // Ingresa a la carpeta del proyecto
    process.chdir(`${D}/${nombreService}`);
    // Crea la carpeta src y el archivo index.js dentro de ella
    fs.mkdirSync('src');
    fs.writeFileSync('./src/index.ts', '');
    
    // Crea las demás carpetas
    fs.mkdirSync('./src/public');
    fs.mkdirSync('./src/routes');
    fs.mkdirSync('./src/controllers');
    fs.mkdirSync('./src/models');
    fs.mkdirSync('./src/config');
    fs.mkdirSync('./src/views');
    fs.writeFileSync('./src/routes/route.ts', '');
    fs.writeFileSync('./src/controllers/DefaultController.ts', '');
    fs.writeFileSync('./src/config/app.ts', '');
    // Crea el archivo package.json
    const packageJson = {
      name: 'mi-proyecto',
      version: '1.0.0',
      description: '',
      main: './src/index.ts',
      scripts: {
        "start": "ts-node ./src/index.ts",
      },
      author: '',
      license: 'ISC'
    };
    const tsConfig = {
      "target": "es5" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
      "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,
      "outDir": "./dist" /* Redirect output structure to the directory. */,
      "strict": false /* Enable all strict type-checking options. */,
      "typeRoots": ["./node_modules/@types"] /* List of folders to include type definitions from. */,
      "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
      "skipLibCheck": true /* Skip type checking of declaration files. */,
      "forceConsistentCasingInFileNames": true, /* Disallow inconsistently-cased references to the same file. */
      "emitDecoratorMetadata": true,
      "experimentalDecorators": true,
    };
    fs.writeFileSync('./package.json', JSON.stringify(packageJson, null, 2));
    fs.writeFileSync('./tsconfig.json', JSON.stringify(tsConfig, null, 2));
    // Instala las dependencias necesarias
    execSync('npm install express --save -E');
    execSync('npm i cors --save -E');
    execSync('npm i dotenv --save -E');
    execSync('npm i morgan --save -E');
    execSync('npm install nodemon --save-dev');
    execSync('npm i --save-dev @types/express -E');
    execSync('npm i --save-dev @types/morgan -E');
    execSync('npm i --save-dev @types/cors -E');
    execSync('npm i ts-node -E');
    
    //execSync('npm install body-parser --save -E');
    // execSync('npm i node-fetch --save -E');
    // execSync('npm i pg --save -E');
    // execSync('npm install express-validator --save -E');

   // Creamos el archivo "inicial"
   const router = ` import { Router } from "express";
                    import { welcome } from '../controllers/DefaultController';
                    const router: Router = Router();
                    router.get("/", welcome)
                    export default router;\n`;
  const app = ` import * as express from 'express'
                import * as morgan from 'morgan'
                import * as cors from 'cors'
                import * as dotenv from "dotenv";
                import WelcomeRoute from '../routes/route';
                const app = express()
                dotenv.config();
                app.use(morgan('tiny'));
                app.use(express.json());
                app.use(express.urlencoded({ extended: true }))
                app.use(cors());
                app.use("/welcome", WelcomeRoute)
                export default app;\n`;
  const index = ` import app from  './config/app'
                  app.listen(3000, () => {
                    console.log('Server is runnin at 3000');
                  });\n`
  const controller = ` import { Request, Response } from "express";
  export const welcome = async(req: Request, res: Response) => {
    return res.send("Bienvenido al controller")
  };\n`;
   fs.writeFile('./src/config/app.ts', app.trim(), (err) => {
      if (err) throw err;
      fs.writeFile('./src/index.ts', index.trim(), (err) => {
        if (err) throw err;
        fs.writeFile('./src/controllers/DefaultController.ts', controller.trim(), (err) => {
        if (err) throw err;
        fs.writeFile('./src/routes/route.ts', router.trim(), (err) => {
          if (err) throw err;
          res.send(`Servicio generado correctamente revisa la siguiente ruta ${D}/${nombreService}`)
        });
      });
    });
  });
};