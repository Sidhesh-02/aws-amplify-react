import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import { View } from "@aws-amplify/ui-react";

export default function App() {
  return (
    <View backgroundColor={{base: "grey"}} padding = {{base: "1rem", large:"6rem"}}>
      <Authenticator loginMechanisms={['email']}>
        {({ signOut, user }) => (
          <main>
            <h1 className="theme">Hello {user.username}</h1>
            <button onClick={signOut}>Sign out</button>
          </main>
        )}
      </Authenticator>
    </View>
  );
}