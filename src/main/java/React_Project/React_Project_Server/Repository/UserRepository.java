package React_Project.React_Project_Server.Repository;

import React_Project.React_Project_Server.Entity.Coin;
import React_Project.React_Project_Server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserId(String userId);
    boolean existsByUserId(String userId);
    boolean existsByPassword(String password);
}

