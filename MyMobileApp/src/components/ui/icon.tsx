import { SymbolView, type AndroidSymbol, type SFSymbol } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { colors } from '@/theme';

// SF Symbols on iOS, Material Symbols on Android and web
const icon = (ios: SFSymbol, material: AndroidSymbol) => ({ ios, android: material, web: material });

const ICONS = {
  home: icon('house', 'home'),
  homeFill: icon('house.fill', 'home'),
  search: icon('magnifyingglass', 'search'),
  bag: icon('bag', 'shopping_bag'),
  bagFill: icon('bag.fill', 'shopping_bag'),
  person: icon('person', 'person'),
  personFill: icon('person.fill', 'person'),
  heart: icon('heart', 'favorite_border'),
  heartFill: icon('heart.fill', 'favorite'),
  star: icon('star.fill', 'star'),
  back: icon('chevron.left', 'arrow_back'),
  forward: icon('arrow.right', 'arrow_forward'),
  chevronRight: icon('chevron.right', 'chevron_right'),
  plus: icon('plus', 'add'),
  minus: icon('minus', 'remove'),
  trash: icon('trash', 'delete'),
  close: icon('xmark', 'close'),
  mail: icon('envelope', 'mail'),
  lock: icon('lock', 'lock'),
  eye: icon('eye', 'visibility'),
  eyeOff: icon('eye.slash', 'visibility_off'),
  logout: icon('rectangle.portrait.and.arrow.right', 'logout'),
  settings: icon('gearshape', 'settings'),
  help: icon('questionmark.circle', 'help'),
  bell: icon('bell', 'notifications'),
  truck: icon('shippingbox', 'local_shipping'),
  shield: icon('checkmark.shield', 'verified_user'),
  returns: icon('arrow.uturn.left', 'replay'),
  check: icon('checkmark.circle.fill', 'check_circle'),
  orders: icon('list.bullet.rectangle', 'receipt_long'),
  location: icon('mappin.and.ellipse', 'location_on'),
  card: icon('creditcard', 'credit_card'),
  filter: icon('slider.horizontal.3', 'tune'),
  sparkles: icon('sparkles', 'auto_awesome'),
  bolt: icon('bolt.fill', 'bolt'),
  info: icon('info.circle', 'info'),
  phone: icon('phone', 'call'),
  chat: icon('bubble.left.and.bubble.right', 'chat'),
  edit: icon('pencil', 'edit'),
  calendar: icon('calendar', 'calendar_today'),
  moon: icon('moon', 'dark_mode'),
  globe: icon('globe', 'language'),
  gift: icon('gift', 'redeem'),
  tag: icon('tag', 'sell'),
  store: icon('storefront', 'storefront'),
  grid: icon('square.grid.2x2', 'grid_view'),
  chart: icon('chart.bar', 'bar_chart'),
  users: icon('person.2', 'group'),
  rupee: icon('indianrupeesign.circle', 'currency_rupee'),
  warning: icon('exclamationmark.triangle', 'warning'),
  eyeSlash: icon('eye.slash', 'visibility_off'),
  image: icon('photo', 'image'),
  audio: icon('headphones', 'headphones'),
  wearables: icon('applewatch', 'watch'),
  electronics: icon('laptopcomputer', 'laptop'),
  footwear: icon('figure.run', 'directions_run'),
  accessories: icon('eyeglasses', 'eyeglasses'),
  fashion: icon('tshirt', 'checkroom'),
} as const;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: ColorValue;
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = 22, color = colors.text, style }: IconProps) {
  return (
    <SymbolView
      name={ICONS[name]}
      size={size}
      tintColor={color}
      style={[{ width: size, height: size }, style]}
    />
  );
}
