define(["require", "exports", "postal"], function(require, exports, postal) {
    describe("group", function () {
        it("test", function () {
        });
    });

    describe("postal.js", function () {
        it("basic test", function () {
            var testchannel = postal.channel("tests");
            var value = undefined;

            testchannel.subscribe("one", function (data) {
                expect(data).toBe("basic");
                value = data;
            });

            testchannel.publish("one", "basic");

            expect(value).toBeDefined();
            expect(value).toBe("basic");
        });

        function EvaluatePostal(subscribeTo, publishTo, expectCallback) {
            var value = undefined;
            var testchannel = postal.channel("tests");

            var subscription = testchannel.subscribe(subscribeTo, function (data, env) {
                expect(expectCallback).toBeTruthy();
                expect(env.channel).toBe("tests");
                expect(env.topic).toBe(publishTo);
                value = data;
            });

            testchannel.publish(publishTo, "message");

            if (expectCallback) {
                expect(value).toBe("message");
            } else {
                expect(value).not.toBeDefined();
            }

            subscription.unsubscribe();
        }

        it("test wildcards", function () {
            EvaluatePostal("logger.*", "logger.warn", true);
            EvaluatePostal("logger.*", "logger.warn.me", false);
            EvaluatePostal("logger.#", "logger.warn.me", true);
            EvaluatePostal("logger/*", "logger/warn", false);
            EvaluatePostal("#", "any.bloody/thing", true);
            EvaluatePostal("*", "any.bloody/thing", false);
            EvaluatePostal("*", "anysingleword", true);
            EvaluatePostal("logger.#", "logger.warn/any.me", true);
        });
    });
});
//# sourceMappingURL=postal.spec.js.map
