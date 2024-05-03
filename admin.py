import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for
)
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db

admin_bp = Blueprint('admin', __name__)

def get_user_list():
    db = get_db()
    user_list = db.execute(
        'SELECT * FROM user'
    ).fetchall()
    
    return user_list

@admin_bp.route('/admin')
def admin():
    user_list = get_user_list()
    return render_template('admin.html', user_list=user_list)


@admin_bp.route('/admin/delete/<int:user_id>', methods=['POST'])
def delete_user(user_id):
    db = get_db()
    # 执行删除用户的 SQL 语句
    db.execute('DELETE FROM user WHERE id = ?', (user_id,))
    db.commit()
    return redirect(url_for('admin.admin'))