import auth from "@state/auth";
import { useSnapshot } from "valtio";

export default function Avatar() {
  const { user } = useSnapshot(auth);
  return (
    <>
      <style jsx>{`
        img {
          width: 40px;
          height: 40px;
          border-radius: 20px;
        }
      `}</style>
      <img src={user.picture} alt={user.name} />
    </>
  );
}
