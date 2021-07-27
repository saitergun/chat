import classNames from 'classnames';

import { createHexColor } from '../util';

import Avatar from './Avatar';

const Message = ({ type, username, message, again, me }) => {
  if (type === 'notification') {
    return (
      <li className="flex items-center justify-center py-1">
        <span
          className="bg-yellow-100 bg-opacity-70 text-yellow-900 text-opacity-75 rounded-2xl py-2 px-4"
        >{message}</span>
      </li>
    );
  }

  if (type === 'notification') {
    return null;
  }

  return (
    <>
      <li
        className={classNames('flex items-start gap-4', {
          'flex-row': !me,
          'flex-row-reverse': me,
        })}
      >
        {!me && (
          <span className="flex items-center justify-center w-7 h-7">
            {!again && (
              <Avatar name={username} size={7} />
            )}
          </span>
        )}

        <span
          className={classNames('max-w-7/12 flex flex-col gap-2', {
            'items-start': !me,
            'items-end': me,
          })}
        >
          <span
            className={classNames('flex flex-col items-start gap-1 py-2.5 px-4', {
              'bg-white shadow-sm rounded-r-2xl rounded-l-lg': !me,
              'bg-gray-200 bg-opacity-50 rounded-l-2xl rounded-r-lg': me,
              'rounded-tl-none': !me && !again,
            })}
          >
            {!me && !again && (
              <span
                className="block leading-none font-500 tracking-wider text-12/16"
                style={{
                  color: createHexColor(username),
                }}
              >{username}</span>
            )}

            <p className="text-left leading-none text-16/16">{message}</p>
          </span>
        </span>
      </li>
    </>
  );
};

export default Message;
