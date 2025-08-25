import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Главная</Link>
        </li>
        <li>
          <Link to="/signin">Вход</Link>
        </li>
        <li>
          <Link to="/signup">Регистрация</Link>
        </li>
        <li>
          <Link to="/profile">Профиль</Link>
        </li>
        <li>
          <Link to="/game">Игра</Link>
        </li>
        <li>
          <Link to="/leaderboard">Лидерборд</Link>
        </li>
        <li>
          <Link to="/forum">Форум</Link>
        </li>
        <li>
          <Link to="/forum/topic">Топик форума</Link>
        </li>
        <li>
          <Link to="/404">404</Link>
        </li>
      </ul>
    </nav>
  )
}
