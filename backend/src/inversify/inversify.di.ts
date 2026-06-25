import { Container } from "inversify";
import { OcrModule } from "./container.js";

const container = new Container({
    defaultScope: "Singleton",
    autobind: true
});

export async function initContainer(): Promise<Container> {
    await container.load(OcrModule);
    return container;
}

export { container };
