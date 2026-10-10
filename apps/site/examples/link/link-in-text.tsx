import { Link } from '@vkieu/mui/vk';

/**
 * Links inside running text are underlined, so they never rely on colour alone. The
 * underline skips the diacritics below the line in Vietnamese. External links open a new
 * tab and say so to screen readers.
 */
export function LinkInText() {
  return (
    <p className="max-w-md text-body-large text-on-surface">
      By creating an account you agree to the{' '}
      <Link href="#terms" external>
        Terms of service
      </Link>{' '}
      and the <Link href="#privacy">Privacy policy</Link>. Tôi đồng ý với{' '}
      <Link href="#dieu-khoan">Điều khoản dịch vụ</Link>.
    </p>
  );
}
