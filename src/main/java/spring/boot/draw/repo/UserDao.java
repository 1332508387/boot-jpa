package spring.boot.draw.repo;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import spring.boot.draw.model.User;

public interface UserDao extends JpaRepository<User, Long>{

	/**
	 * 自定义 SQL，注解形式
	 * 对于 CUD 类型 SQL 需要添加 @Modifying 
	 * ?1: 取方法参数列表中第一个参数的值，如果方法参数有多个，?1 ?2...
	 */
	@Modifying
	@Query(value = "DELETE FROM User WHERE id = ?1")
	int removeUserByMinId(Long id);

	/** 
	 * 符合规则的方法将自动生成 SQL
	 */
	User findByUsername(String username);

	/**
	 * 自定义查询 SQL
	 * nativeQuery = true 使用本地 SQL
	 */
	@Query(value = "SELECT id, username, password FROM tb_user u ORDER BY id DESC LIMIT 0, 2", nativeQuery = true)
	List<User> listUser();
	
	/**
	 * 使用 Sort 进行排序
	 * 调用  userDao.listUserAndSort(new Sort(Sort.Direction.DESC, "paraName"...));
	 */
	@Query(value = "SELECT u FROM User u")
	List<User> listUserAndSort(Sort sort);

	/**
	 * 
	 */
	@Modifying
	@Query(value = "UPDATE User SET password = ?3 WHERE id = ?1 OR username = ?2")
	void updateUserPassword(Long id, String username, String newPasswd);

	/**
	 * 使用命名参数，通过  ":param" 的形式引用
	 */
	@Modifying
	@Query(value = "UPDATE User SET password = :pwd WHERE id = :id OR username = :name")
	void updateUserPassword2(@Param("id") Long id, 
							@Param("name") String username, 
							@Param("pwd") String newPasswd);

	@Modifying
	@Query(value = "UPDATE User SET password = :#{#user.password} WHERE id = :#{#user.id} OR username = :#{#user.username}")
	void updateUserPassword3(@Param("user") User user);

}
