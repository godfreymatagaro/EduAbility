import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Button from '../common/Button';

const RegisterForm = () => {
  const { register } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(username, email, password);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary">Register</h1>
      {error && <p className="text-warning">{error}</p>}
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border border-input-border dark:border-input-border-dark rounded-md"
          aria-label="Username"
        />
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
        <Button variant="secondary" type="submit" ariaLabel="Register">
          Register
        </Button>
      </form>
    </div>
  );
};

export default RegisterForm;