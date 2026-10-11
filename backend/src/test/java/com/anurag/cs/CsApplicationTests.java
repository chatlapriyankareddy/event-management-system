package com.anurag.cs;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
		"app.jwt.secret=test-only-secret-with-at-least-32-bytes",
		"app.cors.allowed-origins=http://localhost:5173"
})
class CsApplicationTests {

	@Test
	void contextLoads() {
	}

}
