import functools

from flask import (
    Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify
)
from werkzeug.security import check_password_hash, generate_password_hash

from db import get_db

eq_bp = Blueprint('equipment', __name__)


status_map = {
    0: '停止',
    1: '启动'
}

@eq_bp.route('/equipment')
def equipment():
    current_username = session.get('username')
    db = get_db()
    eq_list = db.execute('SELECT * FROM equipment').fetchall()
    return render_template('equipment.html', eq_list=eq_list, status_map=status_map, current_username=current_username)

@eq_bp.route('/eq_status', methods=['POST'])
def eq_status():
    if request.method == 'POST':
        eq_id = int(request.form['eq_id'])
        new_status = int(request.form['new_status'])
        db = get_db()
        db.execute('UPDATE equipment SET status = ? WHERE id = ?', (new_status, eq_id))
        db.commit()
        return redirect(url_for('equipment.equipment'))
    
def get_eq_list():
    db = get_db()
    eq_list = db.execute('SELECT * FROM equipment').fetchall()
    return eq_list