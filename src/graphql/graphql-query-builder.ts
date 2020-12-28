/* eslint-disable */
function parceFind(_levelA: any) {

// +++++++++++++++++++++++++++++++++++ work over Array
//++++++++++++++++++++++++++++++++++++++++++++++++++++

  const propsA = _levelA.map((currentValue: any, index: any) => {

    const itemX = _levelA[index];

    if( itemX instanceof GqlQueryBuilder){
      return itemX.toString();
    } if ( ! Array.isArray(itemX) && typeof itemX === "object" ) {
      const props: any = Object.keys(itemX);
      if ( props.length !== 1) {
        throw new RangeError(`Alias objects should only have one value. was passed: ${JSON.stringify(itemX)}`);
      }
      const propS = props[0];
      const item = itemX[propS];
      if (Array.isArray(item)) {
        // @ts-ignore
        return new Query(propS).find(item)
      }
      return `${propS} : ${item} `;
    } if ( typeof itemX === "string" ) {
      return itemX;
    }
    throw new RangeError(`cannot handle Find value of ${itemX}`);

  });

  return propsA.join(",");
}

//= ====================================================
//= ================================== get GraphQL Value
//= ====================================================
// @ts-ignore
function getGraphQLValue(value: any) {
  if (typeof value === "string") {
    value = JSON.stringify(value);
  } else if (Array.isArray(value)) {
    value = value.map(item => {
      return getGraphQLValue(item);
    }).join();
    value = `[${value}]`;
  } else if (typeof value === "object") {
    /* if (value.toSource)
          value = value.toSource().slice(2,-2);
      else */
    value = objectToString(value);
    // console.error("No toSource!!",value);
  }
  return value;
}

function objectToString(obj: any) {

  const sourceA = [];

  for(const prop in obj){
    if (typeof obj[prop] === "function") {
      continue;
    }
    // if ("object" === typeof obj[prop]) {
    sourceA.push(`${prop}:${getGraphQLValue(obj[prop])}`);
    // } else {
    //      sourceA.push(`${prop}:${obj[prop]}`);
    // }
  }
  return `{${sourceA.join()}}`;
}




//= ====================================================
//= ======================================== Query Class
//= ====================================================
// @ts-ignore

export class GqlQueryBuilder {
  private headA: any = [];
  private aliasS: string = '';
  private bodyS: any = '';

  constructor(public readonly fnNameS: string, public readonly _aliasS_OR_Filter?: any) {
    if (typeof _aliasS_OR_Filter === "string") {
      this.aliasS = _aliasS_OR_Filter;
    } else if (typeof _aliasS_OR_Filter === "object") {
      this.filter(_aliasS_OR_Filter);
    } else if (undefined === _aliasS_OR_Filter && arguments.length === 2){
      throw new TypeError("You have passed undefined as Second argument to 'Query'");
    } else if (undefined !== _aliasS_OR_Filter){
      throw new TypeError(`Second argument to 'Query' should be an alias name(String) or filter arguments(Object). was passed ${_aliasS_OR_Filter}`);
    }
  }

  filter = (filtersO: any) => {
    for(const propS in filtersO){
      if (typeof filtersO[propS] === "function") {
        continue;
      }
      const val = getGraphQLValue(filtersO[propS]);
      if (val === "{}") {
        continue;
      }
      this.headA.push( `${propS}:${val}` );
    }
    return this;
  }

  setAlias =  (_aliasS: string) =>{
    this.aliasS = _aliasS;
    return this;
  }

  find = (findA: any) => {
    if( ! findA){
      throw new TypeError("find value can not be >>falsy<<");
    }
    // if its a string.. it may have other values
    // else it sould be an Object or Array of maped values
    // @ts-ignore
    this.bodyS = parceFind((Array.isArray(findA)) ? findA : Array.from(arguments));
    return this;
  }

  toString = () => {
    if (undefined === this.bodyS) {
      throw new ReferenceError("return properties are not defined. use the 'find' function to defined them");
    }

    return `${ (this.aliasS) ? (`${this.aliasS  }:`) : "" } ${this.fnNameS } ${ (this.headA.length > 0)?`(${this.headA.join(",")})`:"" }  { ${ this.bodyS } }`;
  }
}

// export function QueryBuilder(this: any, _fnNameS: string, _aliasS_OR_Filter: any) {
//
//   this.fnNameS = _fnNameS;
//   this.headA = [];
//
//   this.filter = (filtersO: any) => {
//
//     for(const propS in filtersO){
//       if (typeof filtersO[propS] === "function") {
//         continue;
//       }
//       const val = getGraphQLValue(filtersO[propS]);
//       if (val === "{}") {
//         continue;
//       }
//       this.headA.push( `${propS}:${val}` );
//     }
//     return this;
//   };
//
//   if (typeof _aliasS_OR_Filter === "string") {
//     this.aliasS = _aliasS_OR_Filter;
//   } else if (typeof _aliasS_OR_Filter === "object") {
//     this.filter(_aliasS_OR_Filter);
//   } else if (undefined === _aliasS_OR_Filter && arguments.length === 2){
//     throw new TypeError("You have passed undefined as Second argument to 'Query'");
//   } else if (undefined !== _aliasS_OR_Filter){
//     throw new TypeError(`Second argument to 'Query' should be an alias name(String) or filter arguments(Object). was passed ${_aliasS_OR_Filter}`);
//   }
//
//   this.setAlias = (_aliasS: any) =>{
//     this.aliasS = _aliasS;
//     return this;
//   };
//
//   this.find = function(findA: any) { // THIS NEED TO BE A "FUNCTION" to scope 'arguments'
//     if( ! findA){
//       throw new TypeError("find value can not be >>falsy<<");
//     }
//     // if its a string.. it may have other values
//     // else it sould be an Object or Array of maped values
//     this.bodyS = parceFind((Array.isArray(findA)) ? findA : Array.from(arguments));
//     return this;
//   };
// };

//= ====================================================
//= ==================================== Query prototype
//= ====================================================
