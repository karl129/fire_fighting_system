import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db

auth_bp = Blueprint('auth', __name__)


# 注册
@auth_bp.route('/register', methods=('GET', 'POST'))
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None

        if not username:
            error = 'Username is required.'
        elif not password:
            error = 'Password is required.'

        if error is None:
            try:
                db.execute(
                    "INSERT INTO user (username, password) VALUES (?, ?)",
                    (username, generate_password_hash(password)),
                )
                db.commit()
            except db.IntegrityError:
                error = f"User {username} 已经被注册."
            else:
                return redirect(url_for("auth.login"))

        flash(error)

    return render_template('auth/register.html')


# 登录
@auth_bp.route('/', methods=('GET', 'POST'))
def login():
    # 检查是否有会话
    is_login = session.get('user_id')
    if is_login:
        return redirect(url_for('home'))

    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db = get_db()
        error = None
        user = db.execute(
            'SELECT * FROM user WHERE username = ?', (username,)
        ).fetchone()

        if user is None:
            error = '还未注册！'
        elif not check_password_hash(user['password'], password):
            error = '密码错误请重试！'

        if error is None:
            session.clear()
            session['user_id'] = user['id']
            session['username'] = user['username']  # 将用户名存储在 session 中

            return redirect(url_for('home'))

        flash(error)

    return render_template('auth/login.html')


@auth_bp.before_app_request
def load_logged_in_user():
    user_id = session.get('user_id')

    if user_id is None:
        g.user = None
    else:
        g.user = get_db().execute(
            'SELECT * FROM user WHERE id = ?', (user_id,)
        ).fetchone()
        

# 注销   
@auth_bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))


# 验证登录装饰器
def login_required(view):
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for('auth.login'))

        return view(**kwargs)

    return wrapped_view