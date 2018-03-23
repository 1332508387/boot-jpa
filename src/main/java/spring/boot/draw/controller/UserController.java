package spring.boot.draw.controller;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import spring.boot.draw.model.User;
import spring.boot.draw.service.UserService;

@RestController
@RequestMapping("/user")
public class UserController {
	@Resource
	private UserService userService;
	
	/**
	 * 保存用户信息
	 * 
	 * @param user
	 * @return
	 */
	@PostMapping("/save")
	public User save(@RequestBody User user) {
		User resUser = userService.saveUser(user);
		return resUser;
	}
	
	/**
	 * 删除用户信息
	 * 
	 * @param id
	 * @return
	 */
	@DeleteMapping("/remove")
	public String remove(Long id) {
		int flag = userService.removeUserByMinId(id);
		if (flag <= 0) return "FAILED"; 
		return "SUCCESS";
	}
	
	@PostMapping("/saveAndRemove")
	public String saveAndRemove(User user, @RequestParam("uid") Long id) {
		userService.saveAndRemove(user, id);
		return "SUCCESS";
	}
	
	/**
	 * 获取所有用户信息
	 * 
	 * @return
	 */
	@GetMapping("/list")
	public List<User> list() {
		return this.userService.listUser();
	}
	
	@GetMapping("/list2")
	public List<User> list2() {
		return this.userService.listUser2();
	}
	
	/**
	 * 根据用户名获取用户信息
	 * 
	 * @param username
	 * @return
	 */
	@GetMapping("/getUser")
	public User getUser(String username) {
		return userService.getUserByUsername(username);
	}
	
	@PostMapping("/update")
	public String update(Long id, String username, String newPasswd) {
		userService.updateUserPassword(id, username, newPasswd);
		return "SUCCESS";
	}
	
	@PostMapping("/update2")
	public String update2(Long id, String username, String newPasswd) {
		userService.updateUserPassword2(id, username, newPasswd);
		return "SUCCESS";
	}
	
	@PostMapping("/update3")
	public String update3(User user) {
		userService.updateUserPassword3(user);
		return "SUCCESS";
	}
}
