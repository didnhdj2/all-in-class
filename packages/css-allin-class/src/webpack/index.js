class MyClass {
	#privateCount = 0; // 使用私有字段来实现私有变量

	constructor() {
		this.publicCount = 0;
		this.data = {
			modelsCssCache: {}, // 记录每个模块的css变动
			outputCssCache: {}, // 生成过的css缓存，用于输出css
			styleSheet: {
				staticRules: {},
				dynamicRules: {},
				dynamicCompRules: {}
			}, // 
			config: {},
			Plugin: {}
		}
		this.increment()
	}

	increment = () => {
		this.#privateCount++;
		this.publicCount++;
	}
	setPlugin(Plugin) {
		this.data.modelsCssCache = Plugin.modelsCssCache
		this.data.outputCssCache = Plugin.outputCssCache
		this.data.styleSheet = Plugin.styleSheet
		this.data.config = Plugin.config
		this.data.Plugin = Plugin
	}
	getPlugin() {
		return this.data
	}
}
export const data1 = (plugin) => {
	let tempPlugin = new MyClass()
	return function() {
		return tempPlugin
	}
}
export const data = new MyClass();
// function outerFunction() {
// 	let count = 0;

// 	function innerFunction() {
// 		count++;
// 		console.log(count);
// 	}

// 	return innerFunction;
// }

// var closure = outerFunction();
// closure(); // 输出1
// closure(); // 输出2
// closure(); // 输出3
export const Singleton1 = (() => {
  let instance;
  const createInstance = () => {
    // 创建实例的逻辑
    return {
			num: 0
		};
  };
  return {
    getInstance() {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    }
  };
})();

export const Singleton = Singleton1.getInstance()