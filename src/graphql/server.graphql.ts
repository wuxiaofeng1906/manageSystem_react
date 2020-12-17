export namespace server{
type Arrayed<T> = T extends {payload:any}?{[K in keyof T]: K extends 'payload'?T[K][]:T[K]}:T[];
	/**
	 * server: GraphiosTs TypeScript definitions
	*/


	/**
	 * queryType DEFINITIONS
	*/


	 export type query = {
		users:{
			payload:Arrayed<User>['payload'];
			args?:{
				id:scalar_Int
			};
		};
		developerView:{
			payload:Arrayed<DeveloperView>['payload'];
			args:{
				deptIds:scalar_Int[]
			};
		}
	};
	/**
	 * END OF queryType DEFINITIONS
	*/


	/**
	 * mutationType DEFINITIONS
	*/


	/**
	 * END OF mutationType DEFINITIONS
	*/


	/**
	 * subscriptionType DEFINITIONS
	*/


	/**
	 * END OF subscriptionType DEFINITIONS
	*/


	/**
	 * types DEFINITIONS
	*/


	export type User = {
		payload:{
			id:scalar_Float;
			account:scalar_String;
			realname:scalar_String;
			pinyin:scalar_String
		};
	};
	/**
	 * The `Float` scalar type represents signed double-precision fractional values as specified by [IEEE 754](https://en.wikipedia.org/wiki/IEEE_floating_point).
	*/
	export type scalar_Float = number;
	/**
	 * The `String` scalar type represents textual data, represented as UTF-8 character sequences. The String type is most often used by GraphQL to represent free-form human-readable text.
	*/
	export type scalar_String = string;
	export type BugView = {
		payload:{
			count:scalar_Float;
			hotfixCount:scalar_Float;
			sprintCount:scalar_Float;
			featCount:scalar_Float
		};
	};
	export type DeveloperView = {
		payload:{
			user:User;
			activeBugView?:BugView;
			resolveBugView?:BugView
		};
	};
	/**
	 * The `Int` scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1.
	*/
	export type scalar_Int = number;
	/**
	 * The `Boolean` scalar type represents `true` or `false`.
	*/
	export type scalar_Boolean = boolean;
	/**
	 * A GraphQL Schema defines the capabilities of a GraphQL server. It exposes all available types and directives on the server, as well as the entry points for query, mutation, and subscription operations.
	*/
	export type __Schema = {
		payload:{
			description?:scalar_String;
			/**
			 * A list of all types supported by this server.
			*/
			types:Arrayed<__Type>;
			/**
			 * The type that query operations will be rooted at.
			*/
			queryType:__Type;
			/**
			 * If this server supports mutation, the type that mutation operations will be rooted at.
			*/
			mutationType?:__Type;
			/**
			 * If this server support subscription, the type that subscription operations will be rooted at.
			*/
			subscriptionType?:__Type;
			/**
			 * A list of all directives supported by this server.
			*/
			directives:Arrayed<__Directive>
		};
	};
	/**
	 * The fundamental unit of any GraphQL Schema is the type. There are many kinds of types in GraphQL as represented by the `__TypeKind` enum.

Depending on the kind of a type, certain fields describe information about that type. Scalar types provide no information beyond a name, description and optional `specifiedByUrl`, while Enum types provide their values. Object and Interface types provide the fields they describe. Abstract types, Union and Interface, provide the Object types possible at runtime. List and NonNull types compose other types.
	*/
	export type __Type = {
		payload:{
			kind:__TypeKind;
			name?:scalar_String;
			description?:scalar_String;
			specifiedByUrl?:scalar_String;
			fields:{
				payload:Arrayed<__Field>['payload'];
				args?:{
					includeDeprecated?:scalar_Boolean
				};
			};
			interfaces:Arrayed<__Type>;
			possibleTypes:Arrayed<__Type>;
			enumValues:{
				payload:Arrayed<__EnumValue>['payload'];
				args?:{
					includeDeprecated?:scalar_Boolean
				};
			};
			inputFields:{
				payload:Arrayed<__InputValue>['payload'];
				args?:{
					includeDeprecated?:scalar_Boolean
				};
			};
			ofType?:__Type
		};
	};
	/**
	 * An enum describing what kind of type a given `__Type` is.
	*/
	export type __TypeKind  = 'SCALAR' | 'OBJECT' | 'INTERFACE' | 'UNION' | 'ENUM' | 'INPUT_OBJECT' | 'LIST' | 'NON_NULL';
	/**
	 * Object and Interface types are described by a list of Fields, each of which has a name, potentially a list of arguments, and a return type.
	*/
	export type __Field = {
		payload:{
			name:scalar_String;
			description?:scalar_String;
			args:{
				payload:Arrayed<__InputValue>['payload'];
				args?:{
					includeDeprecated?:scalar_Boolean
				};
			};
			type:__Type;
			isDeprecated:scalar_Boolean;
			deprecationReason?:scalar_String
		};
	};
	/**
	 * Arguments provided to Fields or Directives and the input fields of an InputObject are represented as Input Values which describe their type and optionally a default value.
	*/
	export type __InputValue = {
		payload:{
			name:scalar_String;
			description?:scalar_String;
			type:__Type;
			/**
			 * A GraphQL-formatted string representing the default value for this input value.
			*/
			defaultValue?:scalar_String;
			isDeprecated:scalar_Boolean;
			deprecationReason?:scalar_String
		};
	};
	/**
	 * One possible value for a given Enum. Enum values are unique values, not a placeholder for a string or numeric value. However an Enum value is returned in a JSON response as a string.
	*/
	export type __EnumValue = {
		payload:{
			name:scalar_String;
			description?:scalar_String;
			isDeprecated:scalar_Boolean;
			deprecationReason?:scalar_String
		};
	};
	/**
	 * A Directive provides a way to describe alternate runtime execution and type validation behavior in a GraphQL document.

In some cases, you need to provide options to alter GraphQL's execution behavior in ways field arguments will not suffice, such as conditionally including or skipping a field. Directives provide this by describing additional information to the executor.
	*/
	export type __Directive = {
		payload:{
			name:scalar_String;
			description?:scalar_String;
			isRepeatable:scalar_Boolean;
			locations:__DirectiveLocation[];
			args:Arrayed<__InputValue>
		};
	};
	/**
	 * A Directive can be adjacent to many parts of the GraphQL language, a __DirectiveLocation describes one such possible adjacencies.
	*/
	export type __DirectiveLocation  = 'QUERY' | 'MUTATION' | 'SUBSCRIPTION' | 'FIELD' | 'FRAGMENT_DEFINITION' | 'FRAGMENT_SPREAD' | 'INLINE_FRAGMENT' | 'VARIABLE_DEFINITION' | 'SCHEMA' | 'SCALAR' | 'OBJECT' | 'FIELD_DEFINITION' | 'ARGUMENT_DEFINITION' | 'INTERFACE' | 'UNION' | 'ENUM' | 'ENUM_VALUE' | 'INPUT_OBJECT' | 'INPUT_FIELD_DEFINITION';
	/**
	 * END OF types DEFINITIONS
	*/


	/**
	 * END OF server
	*/



}/**
 * Main entry point for GraphiosTs. All queries, mutations and subscriptions are represented here.
*/
export default interface serverGts{

	query:server.query;
}

