# 1 配置
## 1.1 Maven 依赖
```
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```
## 1.2配置属性文件 application.properties
```
spring.datasource.driver-class-name=com.mysql.jdbc.Driver
spring.datasource.url=jdbc:mysql://hostname:3306/dbName?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=UTC
spring.datasource.username=youname
spring.datasource.password=youpassword

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```
## *或使用 application.yml*
```
spring:
  datasource:
    driver-class-name: com.mysql.jdbc.Driver
    url: jdbc:mysql://hostname:3306/dbName?useUnicode=true&characterEncoding=utf-8&useSSL=true&serverTimezone=UTC
    username: youname
    password: youpassword
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```
# 2 编写类
## 2.1 实体类

```
@Entity
@Table(name = "tb_user") 							// 数据库表名
public class User {
	@Id                                             // 主键
	@GeneratedValue(strategy = GenerationType.AUTO) // 自增
	private Long id;
	private String username;
	private String password;
	
	// setter and getter
}
```
## 2.2 Dao 层
 编写接口继承 JpaRepository 接口，此接口中提供了常用的 CRUD 方法，可以直接调用
```
public interface UserDao extends JpaRepository<User, Long>{
	// 自定义方法
}
```
## 2.3 Service 层
注入 UserDao
```
@Service
public class UserService {
	@Resource
	private UserDao userDao;
	
}
```
# 3 查询方式
> 增、删、改操作要使用事务(在Service 层或 Dao 层相应方法上添加 @Transactional 注解)，否则会报如下错：
> javax.persistence.TransactionRequiredException: Executing an update/delete query
## 3.1 直接调用接口 JpaRepository 的方法生成 SQL
```
// 保存用户信息
userDao.save(user);
// 查获取所有用户信息列表
userDao.findAll();
``` 
## 3.2 使用 @Query 注解自定义生成 SQL
```
/**
 * 在 UserDao 中添加自定义方法
 * User 为类名，将关联到 数据库表 tb_user
 */
@Query(value = "SELECT id, username, password FROM User")
List<User> listUser();

/**
 * 对于增、删、改类型 SQL 需要添加 @Modifying 
 * ?1: 取方法参数列表中第一个参数的值，如果方法参数有多个，?1 ?2...
 */
@Modifying
@Query(value = "DELETE FROM User WHERE id = ?1")
int removeUserByMinId(Long id);

/**
 * 多个参数
 * ?1 -> id
 * ?2 -> username
 * ?3 -> newPasswd
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
/**
 * 引用实体类属性
 */
@Modifying
@Query(value = "UPDATE User SET password = :#{#user.password} WHERE id = :#{#user.id} OR username = :#{#user.username}")
void updateUserPassword3(@Param("user") User user);
```
## 3.3 使用关键字创建查询生成 SQL
在 UserDao 中添加方法
```
/**
 * 符合规则的方法将自动生成 SQL
 * <==> SELECT * FROM User WHERE username = ?1
 */
User findByUsername(String username);
```
## *可用关键字如下表*
官方：https://docs.spring.io/spring-data/jpa/docs/current/reference/html/#jpa.sample-app.finders.strategies

|关键字|举例|转化为|
| :-------- | --------:| :--: |
| And  | findByLastnameAndFirstname |  … where x.lastname = ?1 and x.firstname = ?2   |
|Or|findByLastnameOrFirstname | … where x.lastname = ?1 or x.firstname = ?2|
|Is,Equals|findByFirstname，findByFirstnameIs，findByFirstnameEquals |… where x.firstname = ?1 |
|Between| findByStartDateBetween|… where x.startDate between ?1 and ?2 |
|LessThan|findByAgeLessThan |… where x.age < ?1 |
|LessThanEqual| findByAgeLessThanEqual|… where x.age <= ?1 |
|GreaterThan|findByAgeGreaterThan | … where x.age > ?1|
|GreaterThanEqual|findByAgeGreaterThanEqual | … where x.age >= ?1|
|After|findByStartDateAfter | … where x.startDate > ?1|
|Before|findByStartDateBefore | … where x.startDate < ?1|
|IsNull|findByAgeIsNull | … where x.age is null|
|IsNotNull,NotNull|findByAge(Is)NotNull | … where x.age not null|
|Like|findByFirstnameLike | … where x.firstname like ?1|
|NotLike|findByFirstnameNotLike | … where x.firstname not like ?1|
|StartingWith|findByFirstnameStartingWith | … where x.firstname like ?1 (parameter bound with appended %)|
|EndingWith|findByFirstnameEndingWith | … where x.firstname like ?1 (parameter bound with prepended %)|
|Containing|findByFirstnameContaining | … where x.firstname like ?1 (parameter bound wrapped in %)|
|OrderBy|findByAgeOrderByLastnameDesc | … where x.age = ?1 order by x.lastname desc|
|Not|findByLastnameNot | … where x.lastname <> ?1|
|In| findByAgeNotIn(Collection<Age> ages)| … where x.age in ?1|
|NotIn|findByAgeNotIn(Collection<Age> ages) | … where x.age not in ?1|
|True| findByActiveTrue()| … where x.active = true|
|False| findByActiveFalse()| … where x.active = false|
|IgnoreCase| findByFirstnameIgnoreCase| 	… where UPPER(x.firstame) = UPPER(?1)|




