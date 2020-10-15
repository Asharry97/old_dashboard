class VanillaJS_Helper {
    
    static addClass(element, className, removeAnyPreviousClassList) {
        console.log(element, className, removeAnyPreviousClassList);
        this.removeClassList(element, removeAnyPreviousClassList);
        if (className.trim() !== "") {
            element.classList.add(className);
        }
    }

    static removeClassList(element, removeClasses) {
        if (removeClasses === undefined || removeClasses === "") {
            return;
        } else {
            removeClasses.forEach(function(oneClassToRemove) {
                element.classList.remove(oneClassToRemove);
            });
        }
    }

}