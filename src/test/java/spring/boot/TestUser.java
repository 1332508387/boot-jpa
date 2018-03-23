package spring.boot;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import spring.boot.draw.controller.UserController;
import spring.boot.draw.service.UserService;

@RunWith(SpringRunner.class)
@WebMvcTest(UserController.class)
public class TestUser {

	@Autowired
	private MockMvc mvc;

	@MockBean
	private UserService userService;

	@Test
	public void testExample() throws Exception {
//		User user = new User();
//		user.setUsername("aaa");
//		user.setPasword("aaa");
//		given(this.userService.saveUser(user));
//		this.mvc.perform(get("/user/save").accept(MediaType.TEXT_PLAIN)).andExpect(status().isOk())
//				.andExpect(content().string("Honda Civic"));
	}

}
