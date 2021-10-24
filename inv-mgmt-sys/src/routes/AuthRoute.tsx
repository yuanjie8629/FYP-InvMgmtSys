import { Route, Redirect } from 'react-router-dom';


const fakeAuth = {
  isAuthenticated: false,
  signin(cb: () => void) {
    fakeAuth.isAuthenticated = true;
    setTimeout(cb, 100); // fake async
  },
  signout(cb: () => void) {
    fakeAuth.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

interface AuthRouteProps {
  children: React.ReactNode;
}

export default function AuthRoute({ children, ...rest }: AuthRouteProps) {
  return (
    <Route
      {...rest}
      render={() => {
        return fakeAuth.isAuthenticated === true ? (
          children
        ) : (
            <Redirect to={{
              pathname: '/login',
              state: {from: location}
          }} />
        );
      }}
    />
  );
}
