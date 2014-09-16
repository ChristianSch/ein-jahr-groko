'use strict';


describe("Unit: Filters", function() {
	beforeEach(module('einJahrGroKo'));

    describe("trustHtml", function() {
    	it('should create HTML out of the given string', inject(function($sce, trustHtmlFilter) {
    		var testString = '<p>This is a test</p>';

    		expect(trustHtmlFilter).to.be.defined;
    		expect(trustHtmlFilter).to.be.a('function');

    		var res = trustHtmlFilter(testString);

    		expect(res).to.be.defined;

    		// validates that the string got objectified
    		expect(res).to.be.a('Object');

    		// validates equality of original string and generated HTML
    		expect($sce.getTrustedHtml(res)).to.equal(testString);
    	}));
    });
});