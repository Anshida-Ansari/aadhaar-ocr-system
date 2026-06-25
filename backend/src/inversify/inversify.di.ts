import { Container } from "inversify";
import { OcrModule } from "./container.js";
import { IOcrEngine } from "../services/IocrEngine.js";
import { TYPES } from "./type.js";

const container = new Container({
    defaultScope: "Singleton",
    autobind: true
});

export async function initContainer(): Promise<Container> {
    await container.load(OcrModule);

    const engine = container.get<IOcrEngine>(TYPES.IOcrEngine);
    await engine.init();

    return container;
}

export { container };
