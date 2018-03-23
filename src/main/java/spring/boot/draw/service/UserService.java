package spring.boot.draw.service;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import spring.boot.draw.model.User;
import spring.boot.draw.repo.UserDao;

@Service
public class UserService {
	@Resource
	private UserDao userDao;
	
	@Transactional
	public User saveUser(User user) {
		// 使用 Spring Data JPA 提供的方法，保存用户信息
		User retUser = userDao.save(user);
		return retUser;
	}
 
	public List<User> listUser() {
		// 使用 Spring Data JPA 提供的方法，获取所用用户信息
		return userDao.findAll();
	}

	@Transactional
	public int removeUserByMinId(Long id) {
		// 使用注解形式自定义 SQL，删除指定 ID 的用户信息
		int flag = this.userDao.removeUserByMinId(id);
		return flag;
	}

	@Transactional
	public void saveAndRemove(User user, Long id) {
		this.userDao.save(user);
		this.userDao.deleteById(id);
//		saveUser(user);
//		removeUserByMinId(id);
//		int i = 1 / 0;
	}

	public User getUserByUsername(String username) {
		// 使用 Spring Data JPA 提供的关键字自动生成 SQL，删除指定用户名的用户信息
		return userDao.findByUsername(username);
	}

	
	public List<User> listUser2() {
		// 使用注解形式自定义 SQL，获取用户所有用户信息
		return userDao.listUser();
	}

	@Transactional
	public void updateUserPassword(Long id, String username, String newPasswd) {
		userDao.updateUserPassword(id, username, newPasswd);
	}

	@Transactional
	public void updateUserPassword2(Long id, String username, String newPasswd) {
		userDao.updateUserPassword2(id, username, newPasswd);
	}

//	@Transactional
	public void updateUserPassword3(User user) {
		userDao.updateUserPassword3(user);
	}
}
