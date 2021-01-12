export default class Helpers {
    static randomBetween(min: number, max: number): number {
        return min + Math.random() * (max - min)
    }

    static randomIntBetween(min: number, max: number): number {
        return min + Math.floor(Math.random() * (max - min))
    }

    static randomEnum<T>(anEnum: T): T[keyof T] {
        const enumValues = Object.keys(anEnum)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][]
        const randomIndex = Math.floor(Math.random() * enumValues.length)
        const randomEnumValue = enumValues[randomIndex]
        return randomEnumValue;
    }

    
    static blink(component: cc.Component, color: cc.Color) {
        component.node.color = color

        component.scheduleOnce(function () {
            this.node.color = new cc.Color(255, 255, 255)
        }, 0.1);
    }

}