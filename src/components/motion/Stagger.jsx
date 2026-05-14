import { motion } from "framer-motion";
import { staggerContainer, staggerItem, VIEWPORT } from "./motion-presets";

/**
 * Container that staggers its children's reveal on scroll.
 * Pair with <Stagger.Item> for each direct child.
 */
function Stagger({
  as = "div",
  children,
  className,
  delay = 0,
  step = 0.08,
  once = false,
  ...rest
}) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={staggerContainer(step, delay)}
      initial="hidden"
      whileInView="show"
      exit="hidden"
      viewport={{ ...VIEWPORT, once }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

function Item({ as = "div", children, className, y = 22, duration = 0.6, ...rest }) {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      variants={staggerItem(y, duration)}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}

Stagger.Item = Item;
export default Stagger;
