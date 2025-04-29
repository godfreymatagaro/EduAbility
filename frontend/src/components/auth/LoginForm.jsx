import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../common/Button';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary">Log In</h1>
      {error && <p className="text-warning">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border border-input-border dark:border-input-border-dark rounded-md"
          aria-label="Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border border-input-border dark:border-input-border-dark rounded-md"
          aria-label="Password"
        />
        <Button variant="primary" type="submit" ariaLabel="Log in">
          Log In
        </Button>
      </form>
    </div>
  );
};

export default Login;