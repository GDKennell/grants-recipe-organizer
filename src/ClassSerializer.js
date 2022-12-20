export class Serializer {
  constructor(types) {
    this.types = types;
  }
  serialize(object) {
    if (object == undefined) {
      return undefined;
    }
    const idx = this.types.findIndex((e)=> {
      return e.name == object.constructor.name;
    });
    if (idx == -1) {
      console.error('type  \'' + object.constructor.name + '\' not initialized');
    }
    return JSON.stringify([idx, Object.entries(object)]);
  }
  deserialize(jstring) {
    if (jstring == undefined) {
      return undefined;
    }
    const array = JSON.parse(jstring);
    const object = new this.types[array[0]]();
    array[1].map((e)=>{
      object[e[0]] = e[1];
    });
    return object;
  }
}

