import ScreenContainer from "@/components/ScreenContainer";
import { theme } from "@/styles/theme";
import ProfileScreen from "./ProfileScreen";

export default function ProfilePages() {
  return (
    <ScreenContainer backgroundColor={theme.color.background3}>
      <ProfileScreen />
    </ScreenContainer>
  );
}
