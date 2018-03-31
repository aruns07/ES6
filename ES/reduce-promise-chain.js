//Use of Array.prototype.reduce to chain promises

//customTimeout simulates an async API call,
//receiving a variable as parameter and returning a promise 
let customTimeout = function(term) {
    return new Promise((res) => {
        window.setTimeout(function() {
            res(term);
        }, 1000);
    });
    
};

//We want somthing following
Promise.resolve()
        .then(() => {
            return customTimeout('term1')
        })
        .then(() => {
            return customTimeout('term2')
        })
        .then(() => {
            return customTimeout('term3')
        })
        .then(() => {
            return customTimeout('term4')
        });

//Following is the use of reduce to chain the promises.
['term1', 'term2', 'term3', 'term4'].reduce((promise, term) => {
        return promise.then(() => {
            return customTimeout(term)
        })
    }, Promise.resolve());

    