describe("Basic Account Page Test", ()=>{
	describe("ADD", ()=>{
		it("should have home name", ()=>{
			//browser.get("http://localhost:5012/#/");

			element(by.css(".tab-nav a:last-child")).click();
			expect(element(by.id("logo")).isPresent(), "Logo Exists").to.eventually.be.true;
			element(by.id("add-account-button")).click();
			expect(element(by.tagName("h1")).getText()).to.eventually.equal("Account Form Add Page");

			element(by.model("vm.formItem.Name")).sendKeys("Johnny");
			element(by.id("submit-account-button")).click();

			//expect(browser.getCurrentUrl()).to.eventually.equal("http://localhost:5012/#/account/");
			expect(element(by.css(".list ion-item:last-child")).getText()).to.eventually.equal("Johnny");
		});
	})
})