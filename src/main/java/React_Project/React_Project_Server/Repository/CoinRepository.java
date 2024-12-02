package React_Project.React_Project_Server.Repository;

import React_Project.React_Project_Server.Entity.Coin;
import React_Project.React_Project_Server.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CoinRepository extends JpaRepository<Coin, Long> {
    List<Coin> findByUser(User user);
    Optional<Coin> findByUserAndCoinName(User user, String coinName);

}
