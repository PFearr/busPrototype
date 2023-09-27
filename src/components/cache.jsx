// check if client
var Cacher;
if (typeof window !== 'undefined') {
    class CacherClass {
        constructor() {
            this.cache = localStorage.getItem('cache') ? JSON.parse(localStorage.getItem('cache')) : {};
        }
        
        set(key, value) {
            if (import.meta.env.VITE_CacheData == "true"){
                this.cache[key] = value;
                localStorage.setItem('cache', JSON.stringify(this.cache));
            }
            
        }
        
        get(key) {
            if (import.meta.env.VITE_CacheData == "true"){
                return this.cache[key];
            } else {
                return null;
            }
        }
    }
    Cacher = CacherClass;
}else {
    class CacherClass {
        constructor() {
            this.cache = {};
        }
        
        set(key, value) {
            this.cache[key] = value;
            
        }
        
        get(key) {
            if (import.meta.env.VITE_CacheData == "true"){
                return this.cache[key];
            } else {
                return null;
            }
        }
    }
    Cacher = CacherClass;
}

export default Cacher;