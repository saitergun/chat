import { useMemo } from 'react';
import classNames from 'classnames';
import { toUpper } from 'lodash';

import { createHexColor } from '../util';

const Avatar = ({ name, size }) => {
  const sizeClasses = useMemo(() => {
    switch (size) {
      case  5: return 'w-5 h-5 text-16/16';
      case  6: return 'w-6 h-6 text-16/16';
      case  7: return 'w-7 h-7 text-20/16';
      case  8: return 'w-8 h-8 text-20/16';
      case  9: return 'w-9 h-9 text-24/16';
      case 11: return 'w-11 h-11 text-24/16';
      case 12: return 'w-12 h-12 text-36/16';
      case 13: return 'w-13 h-13 text-36/16';
      case 14: return 'w-14 h-14 text-48/16';
      case 15: return 'w-15 h-15 text-48/16';
  
      default:
        return 'w-10 h-10 text-24/16';
    }
  }, [size]);

  if (!name) {
    return null;
  }

  return (
    <figure
      className={classNames('flex items-center justify-center font-600 text-white rounded-full', sizeClasses)}
      style={{
        backgroundColor: createHexColor(name),
        background: `linear-gradient(0deg, ${createHexColor(name)} 0%, ${createHexColor(name)} 100%)`,
      }}
      title={name}
    >
      {name ? toUpper(name.split(/.*?/u).slice(0, 1)) : null}
    </figure>
  );
};

export default Avatar;
