'use strict';


describe('Unit: Constants', function() {
    beforeEach(module('einJahrGroKo'));

    it ('should have an app title', inject(function(APP_TITLE) {
    	expect(APP_TITLE).to.be.defined;
    	expect(APP_TITLE).to.be.a('string');
    }));

    it('should have a data source url', inject(function(DATA_SOURCE_URL) {
    	expect(DATA_SOURCE_URL).to.be.defined;
    	expect(DATA_SOURCE_URL).to.be.a('string');
    }));
});
