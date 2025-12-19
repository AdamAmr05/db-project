/**
 * Next.js API Routes Example
 * 
 * If you're using Next.js, you can use API routes instead of Express.
 * Place these files in: pages/api/ or app/api/ (depending on your Next.js version)
 * 
 * Example: pages/api/employees/index.js
 */

import db from '../../../db-connection';

// For Pages Router (pages/api/employees/index.js)
export default async function handler(req, res) {
  const { method, query, body } = req;

  try {
    switch (method) {
      case 'GET':
        if (query.id) {
          // Get single employee using stored procedure
          const result = await db.callProcedure('GetEmployeeFullProfile', [query.id]);
          if (result.length === 0) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
          }
          return res.status(200).json({ success: true, data: result });
        } else {
          // Get all employees
          const { status, search } = query;
          let sql = 'SELECT * FROM EMPLOYEE WHERE 1=1';
          const params = [];
          
          if (status) {
            sql += ' AND Employment_Status = ?';
            params.push(status);
          }
          
          if (search) {
            sql += ' AND (First_Name LIKE ? OR Last_Name LIKE ?)';
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm);
          }
          
          const employees = await db.query(sql, params);
          return res.status(200).json({ success: true, data: employees });
        }

      case 'POST':
        // Create employee using stored procedure
        const {
          First_Name, Middle_Name, Last_Name, Gender, DOB, Nationality,
          Work_Email, Mobile_Phone, Employment_Status,
          Insurance_Number, Insurance_Start
        } = body;
        
        if (!First_Name || !Last_Name || !Gender || !DOB) {
          return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields' 
          });
        }
        
        await db.callProcedure('AddNewEmployee', [
          First_Name, Middle_Name || null, Last_Name,
          Gender, DOB, Nationality || null,
          Work_Email, Mobile_Phone, Employment_Status,
          Insurance_Number || null, Insurance_Start || new Date()
        ]);
        
        return res.status(201).json({ 
          success: true, 
          message: 'Employee created successfully' 
        });

      case 'PUT':
        // Update employee
        const { id } = query;
        const updates = body;
        
        const allowedFields = [
          'First_Name', 'Middle_Name', 'Last_Name', 'Gender', 'DOB',
          'Mobile_Phone', 'Work_Email', 'Employment_Status'
        ];
        
        const updateFields = [];
        const values = [];
        
        for (const field of allowedFields) {
          if (updates[field] !== undefined) {
            updateFields.push(`${field} = ?`);
            values.push(updates[field]);
          }
        }
        
        if (updateFields.length === 0) {
          return res.status(400).json({ 
            success: false, 
            error: 'No valid fields to update' 
          });
        }
        
        values.push(id);
        const updateSql = `UPDATE EMPLOYEE SET ${updateFields.join(', ')} WHERE Employee_ID = ?`;
        await db.query(updateSql, values);
        
        return res.status(200).json({ 
          success: true, 
          message: 'Employee updated successfully' 
        });

      case 'DELETE':
        // Delete employee
        const { id: deleteId } = query;
        await db.query('DELETE FROM EMPLOYEE WHERE Employee_ID = ?', [deleteId]);
        return res.status(200).json({ 
          success: true, 
          message: 'Employee deleted successfully' 
        });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        return res.status(405).json({ 
          success: false, 
          error: `Method ${method} not allowed` 
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}

// For App Router (app/api/employees/route.js)
// Uncomment and use this format if you're using Next.js 13+ App Router:

/*
import { NextResponse } from 'next/server';
import db from '../../../../db-connection';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  
  try {
    if (id) {
      const result = await db.callProcedure('GetEmployeeFullProfile', [id]);
      return NextResponse.json({ success: true, data: result });
    } else {
      const employees = await db.query('SELECT * FROM EMPLOYEE LIMIT 100');
      return NextResponse.json({ success: true, data: employees });
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      First_Name, Middle_Name, Last_Name, Gender, DOB, Nationality,
      Work_Email, Mobile_Phone, Employment_Status,
      Insurance_Number, Insurance_Start
    } = body;
    
    await db.callProcedure('AddNewEmployee', [
      First_Name, Middle_Name || null, Last_Name,
      Gender, DOB, Nationality || null,
      Work_Email, Mobile_Phone, Employment_Status,
      Insurance_Number || null, Insurance_Start || new Date()
    ]);
    
    return NextResponse.json(
      { success: true, message: 'Employee created successfully' },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
*/

